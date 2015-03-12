class RegistrationsController < Devise::RegistrationsController
  def build_resource(*args)
    super
    if session[:omniauth]
      @user.display_name = session[:omniauth]['info']['name']
      @user.apply_omniauth(session[:omniauth])
      @user.valid?
    end
  end
  
  def create
    super
    session[:omniauth] = nil unless @user.new_record?
  end
  
  def update
    @user.update(registration_params)
    redirect_to randomruns_path
  end
  
  private
    def registration_params
      params.require(:user).permit(:display_name, :name, :email, :password, 
        :password_confirmation, :current_password)
    end
  
end
