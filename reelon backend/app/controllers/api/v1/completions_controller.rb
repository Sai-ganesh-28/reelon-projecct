module Api
  module V1
    class CompletionsController < Api::ApiController
      before_action :set_habit
      before_action :set_completion, only: [:destroy]

      # GET /api/v1/habits/:habit_id/completions
      def index
        @completions = @habit.completions
        render json: @completions
      end

      # POST /api/v1/habits/:habit_id/completions
      def create
        @completion = @habit.completions.new(completion_params)

        if @completion.save
          render json: @completion, status: :created
        else
          render json: { errors: @completion.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/habits/:habit_id/completions/:id
      def destroy
        @completion.destroy
        head :no_content
      end

      private

      def set_habit
        @habit = current_user.habits.find(params[:habit_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Habit not found' }, status: :not_found
      end

      def set_completion
        @completion = @habit.completions.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Completion not found' }, status: :not_found
      end

      def completion_params
        params.require(:completion).permit(:completed_date)
      end
    end
  end
end
