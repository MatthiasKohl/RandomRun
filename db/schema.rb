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

ActiveRecord::Schema.define(version: 20140809162728) do

  create_table "authentications", force: true do |t|
    t.string   "user_id"
    t.string   "provider"
    t.string   "uid"
    t.string   "token"
    t.string   "token_secret"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "random_runs", force: true do |t|
    t.datetime "created_at"
    t.float    "rank",           limit: 24
    t.datetime "updated_at"
    t.float    "angle",          limit: 24
    t.integer  "desired_length"
    t.integer  "actual_length"
    t.float    "startpoint_lat", limit: 24
    t.float    "startpoint_lng", limit: 24
    t.float    "endpoint_lat",   limit: 24
    t.float    "endpoint_lng",   limit: 24
    t.integer  "waypoint_count"
    t.float    "waypoint1_lat",  limit: 24
    t.float    "waypoint1_lng",  limit: 24
    t.string   "waypoint2",      limit: 33
    t.string   "waypoint3",      limit: 33
    t.string   "waypoint4",      limit: 33
    t.string   "waypoint5",      limit: 33
    t.string   "waypoint6",      limit: 33
    t.string   "waypoint7",      limit: 33
    t.string   "waypoint8",      limit: 33
  end

  add_index "random_runs", ["startpoint_lat", "startpoint_lng", "waypoint1_lat", "waypoint1_lng", "endpoint_lat", "endpoint_lng", "waypoint2", "waypoint3", "waypoint4", "waypoint5", "waypoint6", "waypoint7", "waypoint8"], name: "route", unique: true, using: :btree

  create_table "random_runs_users", id: false, force: true do |t|
    t.integer "user_id"
    t.integer "random_run_id"
  end

  add_index "random_runs_users", ["user_id", "random_run_id"], name: "index_random_runs_users_on_user_id_and_random_run_id", unique: true, using: :btree

  create_table "run_instances", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "attempted"
    t.boolean  "completed"
    t.integer  "rating"
    t.integer  "duration_in_ms"
    t.datetime "started_at"
    t.datetime "ended_at"
    t.integer  "random_run_id"
  end

  add_index "run_instances", ["random_run_id"], name: "index_run_instances_on_random_run_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "display_name"
    t.string   "name"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
