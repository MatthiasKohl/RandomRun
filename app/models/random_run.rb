class RandomRun < ActiveRecord::Base
  has_and_belongs_to_many :users
  has_many :run_instances
  attr_accessor :route
  
  def self.get_hash_from_points(points)
    random_run_hash = Hash.new
    startpoint = points[0].split(',')
    if startpoint.length != 2
      return #TODO
    end
    random_run_hash["startpoint_lat"] = startpoint[0]
    random_run_hash["startpoint_lng"] = startpoint[1]
    endpoint = points[points.length-1].split(',')
    if endpoint.length != 2
      return #TODO
    end
    random_run_hash["endpoint_lat"] = endpoint[0]
    random_run_hash["endpoint_lng"] = endpoint[1]
    waypoint1 = points[1].split(',')
    if waypoint1.length != 2
      return #TODO
    end
    random_run_hash["waypoint1_lat"] = waypoint1[0]
    random_run_hash["waypoint1_lng"] = waypoint1[1]
    for i in 2..(points.length-2)
      random_run_hash["waypoint" + i.to_s(10)] = points[i]
    end
    return random_run_hash
  end
  
  def self.get_points_from_route(route)
    points = route.split('|')
    if points.length <= 2
      return #TODO
    end
    return points
  end
  
  def get_route
    route_string = startpoint_lat.to_s + "," + startpoint_lng.to_s
    if waypoint1_lat.present? && waypoint1_lat != 0
      route_string = route_string + "|" + waypoint1_lat.to_s + ","  + waypoint1_lng.to_s
    end
    waypoints = [waypoint2, waypoint3, waypoint4, waypoint5, waypoint6, waypoint7, waypoint8]
    waypoints.each do |a|
      if a.present?
        route_string = route_string + "|" + a
      else
        break
      end
    end
    route_string = route_string + "|" + endpoint_lat.to_s + "," + endpoint_lng.to_s
    return route_string
  end
end
