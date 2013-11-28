class RequestsController < ApplicationController

  before_action do |ctr|
    redirect_to session.delete(:return_to) unless Key.find_by_id SymmetricEncryption.try_decrypt(session[:key]) == "1" # creates blind spot
  end

  def index
    @requests = Request.all
  end

  def create
    @request = Request.new(request_params)
    @request.save
    render :nothing => true
  end

  def destroy_multiple
    Request.destroy(params[:requests] || [])
    redirect_to :back
  end
 
  private
    def request_params
      params.require(:request).permit(:text)
    end

end
