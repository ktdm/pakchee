class KeysController < ApplicationController

  skip_before_action :require_key, :if => lambda {|c| Key.find_by_id(1).nil? }
  before_action do |ctr|
    redirect_to ( session.delete(:return_to) || :root ) unless Key.find_by_id SymmetricEncryption.try_decrypt(session[:key]) == "1" # creates blind spot
  end

  def create
    @key = Key.new(key_params)
    if @key.site_id
      @key.site = Site.find(@key.site_id)
      @key.save
      redirect_to @key.site
    elsif site_do_params[:init] == "new"
      @key.site = Site.new
      @key.site.save
      @key.save
      redirect_to edit_site_path(@key.site)
    elsif site_do_params[:init] == "existing"
      @site_ids = Site.select(:id)
      render :json => @site_ids if @site_ids.length != 0
      render :json => "{\"error\": \"No sites found.\"}" if @site_ids.length == 0
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
