# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20131209080746) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "keys", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "requests", force: true do |t|
    t.text     "text"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles", id: false, force: true do |t|
    t.integer "key_id",  null: false
    t.integer "site_id", null: false
    t.string  "title"
  end

  add_index "roles", ["key_id", "site_id"], name: "index_roles_on_key_id_and_site_id", using: :btree
  add_index "roles", ["site_id", "key_id"], name: "index_roles_on_site_id_and_key_id", using: :btree

  create_table "sites", force: true do |t|
    t.text     "ops",        default: "--- {}\n"
    t.string   "state"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
