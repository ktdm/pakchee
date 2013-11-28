class ApplicationController < ActionController::Base

  protect_from_forgery with: :exception
  before_action :require_key
 
  private
 
  def require_key
    unless session[:key]
      flash[:notice] = "Get a key."
      redirect_to :root
    end
    session[:return_to] ||= request.referer
  end

end
