class SitesController < ApplicationController

  def index
  end

  def show
    @site = Site.find(params[:id])
  end

  def create
  end

  def edit
    @site = Site.find(params[:id])
  end

  def update
    @site = Site.find(params[:id])
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

end
