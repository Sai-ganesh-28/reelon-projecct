module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :verify_authenticity_token
      
      # POST /api/v1/auth/signup
      def signup
        user = User.new(user_params)
        
        if user.save
          token = JwtService.encode(user_id: user.id)
          render json: { 
            token: token, 
            user: { 
              id: user.id, 
              email: user.email, 
              name: user.name 
            } 
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      # POST /api/v1/auth/login
      def login
        user = User.find_by(email: params[:email])
        
        if user&.authenticate(params[:password])
          token = JwtService.encode(user_id: user.id)
          render json: { 
            token: token, 
            user: { 
              id: user.id, 
              email: user.email, 
              name: user.name 
            } 
          }
        else
          render json: { error: 'Invalid email or password' }, status: :unauthorized
        end
      end
      
      # GET /api/v1/auth/me
      def me
        token = extract_token
        return render json: { error: 'Unauthorized' }, status: :unauthorized unless token
        
        decoded = JwtService.decode(token)
        return render json: { error: 'Unauthorized' }, status: :unauthorized unless decoded
        
        user = User.find_by(id: decoded[:user_id])
        if user
          render json: { 
            user: { 
              id: user.id, 
              email: user.email, 
              name: user.name 
            } 
          }
        else
          render json: { error: 'User not found' }, status: :not_found
        end
      end
      
      private
      
      def user_params
        params.permit(:email, :password, :name)
      end
      
      def extract_token
        header = request.headers['Authorization']
        header&.split(' ')&.last
      end
    end
  end
end
