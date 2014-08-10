class CreateRandomRunsUsers < ActiveRecord::Migration
  def change
    create_table :random_runs_users, id: false do |t|
      t.belongs_to :user
      t.belongs_to :random_run
    end
    add_index :random_runs_users, ["user_id", "random_run_id"], :unique => true
  end
end
