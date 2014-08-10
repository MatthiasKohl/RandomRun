class CreateRandomRuns < ActiveRecord::Migration
  def change
    create_table :random_runs do |t|
      t.datetime :created_at
      t.datetime :updated_at
      t.float :rank
      t.float :angle
      t.integer :desired_length
      t.integer :actual_length
      t.float :startpoint_lat
      t.float :startpoint_lng
      t.float :endpoint_lat
      t.float :endpoint_lng
      t.integer :waypoint_count
      t.float :waypoint1_lat
      t.float :waypoint1_lng
      t.string :waypoint2, :limit => 33
      t.string :waypoint3, :limit => 33
      t.string :waypoint4, :limit => 33
      t.string :waypoint5, :limit => 33
      t.string :waypoint6, :limit => 33
      t.string :waypoint7, :limit => 33
      t.string :waypoint8, :limit => 33
 
      t.timestamps
    end
    add_index :random_runs, ["startpoint_lat", "startpoint_lng", 
    "endpoint_lat", "endpoint_lng", "waypoint1_lat", "waypoint1_lng",
    "waypoint2", "waypoint3", "waypoint4", "waypoint5", "waypoint6", 
    "waypoint7", "waypoint8"], :unique => true, :name => "route"
  end
end
