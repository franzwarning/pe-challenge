require "sidekiq/web"

Rails.application.routes.draw do
  mount Sidekiq::Web => "/sidekiq"

  get "up" => "rails/health#show", :as => :rails_health_check

  # views
  root "home#index"

  # api for creating files
  namespace :api do
    namespace :v1 do
      resources :files do
        post :presigned_url, on: :collection
      end

      namespace :webhooks do
        resources :supabase, only: [:create]
      end
    end
  end
end
