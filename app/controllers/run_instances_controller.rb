class RunInstancesController < ApplicationController
  def create
    @randomrun = RandomRun.find(randomrun_params[:id])
    @run_instance = @randomrun.run_instances.create(runinstance_params)
    @run_instance.save
    redirect_to root_path
  end
  
  def update
#    
#    @run_instance = RunInstance.find(params[:id])
#    if runinstance_params[:started_at].present?
#      @run_instance.attempted = true
#      @run_instance.started_at = runinstance_params[:started_at]
#    end
#    if runinstance_params[:ended_at].present? && runinstance_params[:completed].present? && 
#        runinstance_params[:duration_in_ms].present?
#      @run_instance.completed = runinstance_params[:completed]
#      @run_instance.ended_at = runinstance_params[:ended_at]
#      @run_instance.duration_in_ms = runinstance_params[:duration_in_ms]
#    end
#    if runinstance_params[:rating].present?
#      @run_instance.rating = runinstance_params[:rating]
#    end
#    @run_instance.save
#    
  end
  
  private def runinstance_params
    params.require(:run_instance).permit(:started_at, :ended_at, :completed, 
      :duration_in_ms, :rating, :attempted)
  end
  
  private def randomrun_params
    params.require(:randomrun).permit(:id)
  end
end
