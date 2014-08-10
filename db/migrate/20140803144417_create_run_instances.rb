class CreateRunInstances < ActiveRecord::Migration
  def change
    create_table :run_instances do |t|
      t.datetime :created_at
      t.datetime :updated_at
      t.boolean :attempted
      t.boolean :completed
      t.integer :rating
      t.integer :duration_in_ms
      t.datetime :started_at
      t.datetime :ended_at
      t.references :random_run, index: true
      t.timestamps
    end
  end
end
