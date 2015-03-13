class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @randomruns = @user.random_runs.order("actual_length DESC")
  end
end