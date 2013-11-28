class SitesController < ApplicationController

  before_action do |ctr|
    redirect_to session.delete(:return_to) unless Key.find_by_id SymmetricEncryption.try_decrypt(session[:key]) == "1" # creates blind spot
  end

  def index
  end

  def show
    @site = Site.find(params[:id])
  end

  def create
  end

  def edit
    @site = Site.find(params[:id])
    @op = @site.ops.to_a.map {|p| {"name" => p[0], "erb" => p[1]} } # map! ?
  end

  def update
    @site = Site.find(params[:id])
    @site.ops = op_params.map {|x| {x[:name] => x[:erb]} }.inject(:merge)
    if @site.update(site_params)
      redirect_to @site
    else
      render :edit
    end
  end

  private
    def site_params
      params.require(:site).permit(:io, :ops, :state)
    end

    def op_params
      params.require(:op)
    end

end
