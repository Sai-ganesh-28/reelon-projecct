module Api
  module V1
    class StreaksController < ApplicationController
      before_action :authenticate_request
      before_action :set_habit

      # GET /api/v1/habits/:habit_id/streak
      def show
        render json: @habit.streak
      end

      private

      def set_habit
        @habit = current_user.habits.find(params[:habit_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Habit not found' }, status: :not_found
      end
    end
  end
end
