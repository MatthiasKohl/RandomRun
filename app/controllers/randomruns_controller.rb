class RandomrunsController < ApplicationController
  def new 
    @randomrun = RandomRun.new
    @run_instance = RunInstance.new
  end
  
  def create
    @user = User.find(current_user.id)
    route = randomrun_params[:route]
    points = RandomRun.get_points_from_route(route)
    random_run_hash = RandomRun.get_hash_from_points(points)
    @randomrun = RandomRun.find_by random_run_hash
    
    if @randomrun.nil?
      create_hash = random_run_hash.clone
      create_hash["waypoint_count"] = points.length - 2
      create_hash["desired_length"] = randomrun_params[:desired_length]
      create_hash["angle"] = randomrun_params[:angle]
      create_hash["actual_length"] = randomrun_params[:actual_length]
      @randomrun = RandomRun.new(create_hash)
    end
    
    @randomrun.route = route
    
    if @randomrun.save
      @userrun = @user.random_runs.find_by random_run_hash
      if @userrun.nil?
        @user.random_runs << @randomrun
      end
      redirect_to randomrun_path(@randomrun)
    end
  end
  
  def update
    @randomrun = RandomRun.find(params[:id])
    @randomrun.update(randomrun_params)
  end
  
  def show
    @randomrun = RandomRun.find(params[:id])
    @randomrun.route = @randomrun.get_route
  end
  
  private def randomrun_params
    params.require(:random_run).permit(:route, :angle, :desired_length, 
      :actual_length)
  end
end
