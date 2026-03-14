# DB設計: GeekSalon 受講生作品集サイト

Neon (PostgreSQL)

## テーブル構成

### users

受講生（Googleログインで登録）


| カラム        | 型           | 制約              | 備考               |
| ---------- | ----------- | --------------- | ---------------- |
| id         | UUID        | PRIMARY KEY     | gen_random_uuid() |
| google_id  | TEXT        | UNIQUE NOT NULL | Google OAuthのsub |
| name       | TEXT        | NOT NULL        | 表示名              |
| email      | TEXT        | UNIQUE NOT NULL |                  |
| avatar_url | TEXT        |                 | Googleプロフィール画像   |
| created_at | TIMESTAMPTZ | NOT NULL        | DEFAULT now()    |


### works

受講生の作品


| カラム         | 型           | 制約                       | 備考                              |
| ----------- | ----------- | ------------------------ | ------------------------------- |
| id          | UUID        | PRIMARY KEY              | gen_random_uuid()               |
| user_id     | UUID        | NOT NULL, FK → users(id) | 投稿者                             |
| title       | TEXT        | NOT NULL                 | 作品名                             |
| url         | TEXT        | NOT NULL                 | デプロイURL                         |
| image_key   | TEXT        | NOT NULL                 | R2のオブジェクトキー                     |
| tech_stack  | JSONB       | NOT NULL                 | 配列 例: ["React", "Firebase"]     |
| description | TEXT        | NOT NULL                 | 説明文                             |
| author_name | TEXT        | NOT NULL                 | 制作者名（users.nameとは別に持つ）          |
| duration    | TEXT        | NOT NULL                 | 制作期間 例: "2ヶ月"                   |
| course      | TEXT        | NOT NULL                 | コース名 例: "Web Expert"            |
| cohort      | INTEGER     |                          | 期 例: 30                         |
| highlight   | TEXT        |                          | こだわりポイント（任意）                    |
| created_at  | TIMESTAMPTZ | NOT NULL                 | DEFAULT now()                   |
| updated_at  | TIMESTAMPTZ | NOT NULL                 | DEFAULT now()                   |


## 設計判断

- **author_name を users.name と別に持つ**: 作品ごとに表示名を変えられるように
- **tech_stack は JSONB で保存**: PostgreSQLのJSONBを活用。配列として格納
- **course はTEXTで保存**: コース数が少ない（5種）のでマスタテーブル不要
- **cohort は INTEGER**: ソート可能にするため数値で保持
- **日時は TIMESTAMPTZ**: PostgreSQLのネイティブ型を使用

## 認証・登録の仕組み

- `/register` のURLを受講生にのみ共有（サイト上にリンクは掲載しない）
- Googleログインで登録・認証
- 招待コードやホワイトリストは使わない（URLの非公開で十分）

