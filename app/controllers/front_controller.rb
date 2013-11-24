class FrontController < ApplicationController

  def index
    if session[:key]
      key = Key.find_by_id SymmetricEncryption.try_decrypt(session[:key])
      redirect_to ( key && key.site || :root )
    end
  end

  def login
    key = Key.find_by_id SymmetricEncryption.try_decrypt(key_params[:cipher].slice(6..-1) + "==")
    if key
      session[:key] = key_params[:cipher].slice(6..-1) + "=="
      redirect_to key.site
    else
      flash[:notice] = "Not found."
      redirect_to :back
    end
  end

  def logout
    session[:key] = nil
    redirect_to :root
  end

  def scaffold
  end

  private
    def key_params
      params.require(:key).permit(:cipher)
    end

end
