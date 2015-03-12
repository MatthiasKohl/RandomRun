class AuthenticationsController < ApplicationController
  def index
    redirect_to randomruns_path
  end
  
  def twitter
    authenticate_user(false)
  end
  
  def facebook
    authenticate_user(true)
  end
  
  protected def authenticate_user(has_email)
    #raise request.env["omniauth.auth"].to_yaml
    
    omni = request.env["omniauth.auth"]
    
    authentication = Authentication.find_by_provider_and_uid(omni['provider'],
      omni['uid'])
        
    if authentication
      flash[:notice] = "Logged in Successfully"
      sign_in_and_redirect User.find(authentication.user_id)
    elsif current_user
      current_user.authentications.create!(:provider => omni['provider'],
        :uid => omni['uid'], :token => omni['credentials']['token'], 
        :token_secret => omni['credentials']['secret'])
      flash[:notice] = "Authentication successful."
      sign_in_and_redirect current_user
    else
      user = User.find_by_email(omni['extra']['raw_info']['email'])
      if user
        user.authentications.create!(:provider => omni['provider'],
        :uid => omni['uid'], :token => omni['credentials']['token'], 
        :token_secret => omni['credentials']['secret'])
        flash[:notice] = "Logged in."
        sign_in_and_redirect user
      else
        user = User.new
        if has_email
          user.email = omni['extra']['raw_info']['email'].to_s
        end
        user.apply_omniauth(omni)

        if user.save
          flash[:notice] = "Logged in."
          sign_in_and_redirect User.find(user.id)
        else
          session[:omniauth] = omni.except('extra')
          redirect_to new_user_registration_path
        end
      end
    end
  end
end
