Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # API routes
  namespace :api do
    namespace :v1 do
      # Authentication routes
      post 'auth/signup', to: 'auth#signup'
      post 'auth/login', to: 'auth#login'
      get 'auth/me', to: 'auth#me'
      
      # Habits routes
      resources :habits do
        member do
          post 'toggle_completion'
        end
        
        # Nested completions routes
        resources :completions, only: [:index, :create, :destroy]
        
        # Nested streak route
        resource :streak, only: [:show]
      end
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
