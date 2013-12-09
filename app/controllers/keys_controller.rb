class KeysController < ApplicationController

  skip_before_action :require_key, :if => lambda {|c| Key.find_by_id(1).nil? }
  before_action do |ctr|
    redirect_to ( session.delete(:return_to) || :root ) unless Key.find_by_id SymmetricEncryption.try_decrypt(session[:key]) == "1" # creates blind spot
  end

  def create
    if key_params[:site_id]
      key = Key.new
      key.save
      site = Site.find_by_id(key_params[:site_id])
      key.roles << site.roles.build(title: key_params[:role])
      key.save
      redirect_to site
    elsif site_do_params[:init] == "new"
      key = Key.new
      key.save
      site = Site.create
      key.roles << site.roles.build(title: key_params[:role])
      key.save
      redirect_to edit_site_path(site)
    elsif site_do_params[:init] == "existing"
      site_ids = Site.select(:id)
      render :json => site_ids if site_ids.length != 0 #move to views? 
      render :json => "{\"error\": \"No sites found.\"}" if site_ids.length == 0
    end
  end

  private
    def key_params
      params.require(:key).permit(:role, :site_id)
    end

    def site_do_params
      params.require(:site_do).permit(:init)
    end

end
