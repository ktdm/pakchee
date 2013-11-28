Pakchee::Application.routes.draw do

  root "front#index"

  post "post", to: "front#post"
  post "login", to: "front#login"
  get "logout", to: "front#logout"

  resources :keys, :only => [:index, :create]

  resources :sites

  resources :requests, :only => [:index, :create] do
    collection do
      delete 'destroy_multiple'
    end
  end

  match "/*local", to: "front#index", via: :get

end
