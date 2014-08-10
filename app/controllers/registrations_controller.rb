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
end
