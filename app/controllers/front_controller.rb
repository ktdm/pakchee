class FrontController < ApplicationController

  skip_before_action :require_key, only: [:index, :login, :logout]
  before_action :require_key, only: :index, :unless => lambda {|c| params[:local].nil? } #https://github.com/rails/rails/issues/9703

  def index
    if session[:key]
      @site = Site.find_all_by_id(Key.find_by_id( SymmetricEncryption.try_decrypt(session[:key]) ).roles.select(:site_id)).first #find which?
      state_dir = File.join(Rails.root, "storage", @site.state)
      filepath = File.join(state_dir, @glob = ( params[:local] && params[:local].to_s + "." + params[:format].to_s || "index.html" ))
      document = [".html", ".htm"].index(File.extname(filepath)).nil? ? File.read(filepath) : csrf_protect(File.read(filepath)) #make safe
      render text: document
    end
  rescue Errno::ENOENT
    render text: "<body style=\"background-color:red\"><h1>Not found.</h1></body>", status: :not_found
  end

  def post
    @site = Site.find_by_id(Key.find_by_id( SymmetricEncryption.try_decrypt(session[:key]) ).roles.select(:site_id)) #optimise
    ops_to_run = @site.ops.select { |p| params.except("authenticity_token", "action", "controller").has_key? p } #TODO: multi ops
    ops_to_run.each { |k, v| instance_variable_set("@#{k}", params[k]) }
    prep_io
    render inline: ops_to_run.values.inject(:concat) #sanitise with block?
  end

  def login
    ( Key.find_by_id SymmetricEncryption.try_decrypt(key_params[:cipher].slice(6..-1) + "==") ) ?
      session[:key] = key_params[:cipher].slice(6..-1) + "==" :
      flash[:notice] = "Not found."
    redirect_to :back
  end

  def logout
    session[:key] = nil
    redirect_to :root
  end

  def ping
    render :nothing => true
  end

  private
    def key_params
      params.require(:key).permit(:cipher)
    end

    def csrf_protect(file)
      doc = Nokogiri::HTML(file)
      doc.xpath("//form/*[1]").each do |formfirst|
        formfirst.before (
          "<input type=\"hidden\" name=\"" + request_forgery_protection_token.to_s + "\" value=\"" + form_authenticity_token + "\" />"
        )
      end
      doc.to_html(:indent => 2) #not indenting, only first form being modified
    end

    def prep_io
      Dir.chdir File.join(Rails.root, "storage", @site.state)
    end

end
