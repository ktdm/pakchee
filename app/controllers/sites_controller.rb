class SitesController < ApplicationController

  before_action do |ctr|
    return if ctr.action_name == "index" && session[:key]
    redirect_to ( session.delete(:return_to) || :root ) unless Key.find_by_id SymmetricEncryption.try_decrypt(session[:key]) == "1" # creates blind spot
  end

  def index
    if session[:site]
      redirect_to :root
    else
      key = Key.find_by_id SymmetricEncryption.try_decrypt(session[:key])
      @sites = Site.find_all_by_id key.roles.pluck(:site_id)
      if @sites.length == 1
        session[:site] = @sites.first.id
        redirect_to :root
      end
    end
  end

  def show
    @site = Site.find(params[:id])
  end

  def create
  end

  def edit
    @site = Site.find_by_id params[:id]
    @op = @site.ops.to_a.map {|p| {"name" => p[0], "erb" => p[1]} } # map! ?
  end

  def update
    @site = Site.find_by_id params[:id]
    @site.ops = op_params.map {|x| {x[:name] => x[:erb]} }.inject(:merge)
    if @site.save
      redirect_to @site
    else
      render :edit
    end
  end

  def run
    session[:site] = Site.where(state: run_params[:hash]).first.id #optimise using session[:key]
    redirect_to :root
  end

  def quit
    session[:site] = nil
    redirect_to "/sites"
  end

  private
    def site_params
      params.require(:site).permit(:ops, :state)
    end

    def op_params
      params.require(:op)
    end

    def run_params
      params.require(:site).permit(:hash)
    end

end
