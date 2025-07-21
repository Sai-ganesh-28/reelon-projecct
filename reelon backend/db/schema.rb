# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_21_053032) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "completions", force: :cascade do |t|
    t.bigint "habit_id", null: false
    t.date "completed_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["habit_id"], name: "index_completions_on_habit_id"
  end

  create_table "habits", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_habits_on_user_id"
  end

  create_table "streaks", force: :cascade do |t|
    t.bigint "habit_id", null: false
    t.integer "current_streak"
    t.integer "longest_streak"
    t.date "last_completed_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["habit_id"], name: "index_streaks_on_habit_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email"
  end

  add_foreign_key "completions", "habits"
  add_foreign_key "habits", "users"
  add_foreign_key "streaks", "habits"
end
