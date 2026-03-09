import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateChatMessagesToConversations1773061000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Создаём один conversation на уникального авторизованного автора (по email),
    //    связываем с users если email совпадает
    await queryRunner.query(`
      INSERT INTO conversations (id, "guestName", "guestEmail", "isAnonymous", "createdAt", "updatedAt", user_id)
      SELECT
        uuid_generate_v4(),
        m."authorName",
        m."authorEmail",
        false,
        MIN(m."createdAt"),
        MAX(m."createdAt"),
        u.id
      FROM chat_messages m
      LEFT JOIN users u ON u.email = m."authorEmail"
      WHERE m."isAnonymous" = false AND m."authorEmail" IS NOT NULL
      GROUP BY m."authorEmail", m."authorName", u.id
    `);

    // 2. Переносим сообщения авторизованных пользователей в conversation_messages
    await queryRunner.query(`
      INSERT INTO conversation_messages (id, text, "isFromAdmin", "createdAt", conversation_id)
      SELECT
        uuid_generate_v4(),
        m.text,
        false,
        m."createdAt",
        c.id
      FROM chat_messages m
      JOIN conversations c ON c."guestEmail" = m."authorEmail"
      WHERE m."isAnonymous" = false AND m."authorEmail" IS NOT NULL
    `);

    // 3. Анонимные — каждое сообщение в свой conversation через PL/pgSQL цикл
    await queryRunner.query(`
      DO $$
      DECLARE
        msg RECORD;
        conv_id UUID;
      BEGIN
        FOR msg IN SELECT * FROM chat_messages WHERE "isAnonymous" = true LOOP
          INSERT INTO conversations (id, "guestName", "guestEmail", "isAnonymous", "createdAt", "updatedAt")
          VALUES (uuid_generate_v4(), msg."authorName", NULL, true, msg."createdAt", msg."createdAt")
          RETURNING id INTO conv_id;

          INSERT INTO conversation_messages (id, text, "isFromAdmin", "createdAt", conversation_id)
          VALUES (uuid_generate_v4(), msg.text, false, msg."createdAt", conv_id);
        END LOOP;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем мигрированные данные — оригинальная chat_messages остаётся нетронутой
    await queryRunner.query(`DELETE FROM conversation_messages`);
    await queryRunner.query(`DELETE FROM conversations`);
  }
}
