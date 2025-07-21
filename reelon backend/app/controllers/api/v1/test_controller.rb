module Api
  module V1
    class TestController < ApplicationController
      include Authenticable
      
      # GET /api/v1/test/protected
      def protected
        render json: { message: "This is a protected endpoint", user_id: current_user.id }
      end
      
      # GET /api/v1/test/public
      def public
        render json: { message: "This is a public endpoint" }
      end
      
      # Skip authentication for public endpoint
      skip_before_action :authenticate_user, only: [:public]
    end
  end
end
