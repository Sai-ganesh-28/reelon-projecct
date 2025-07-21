module Api
  module V1
    class HabitsController < Api::ApiController
      before_action :set_habit, only: [:show, :update, :destroy, :toggle_completion]

      # GET /api/v1/habits
      def index
        @habits = current_user.habits
        render json: @habits, include: [:streak]
      end

      # GET /api/v1/habits/:id
      def show
        render json: @habit, include: [:streak, :completions]
      end

      # POST /api/v1/habits
      def create
        @habit = current_user.habits.new(habit_params)

        if @habit.save
          render json: @habit, status: :created
        else
          render json: { errors: @habit.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/habits/:id
      def update
        if @habit.update(habit_params)
          render json: @habit
        else
          render json: { errors: @habit.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/habits/:id
      def destroy
        @habit.destroy
        head :no_content
      end

      # POST /api/v1/habits/:id/toggle_completion
      def toggle_completion
        date = params[:date] ? Date.parse(params[:date]) : Date.today
        is_completed = @habit.toggle_completion(date)
        
        render json: { 
          habit_id: @habit.id, 
          date: date, 
          completed: is_completed,
          streak: @habit.streak
        }
      end

      private

      def set_habit
        @habit = current_user.habits.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Habit not found' }, status: :not_found
      end

      def habit_params
        params.require(:habit).permit(:name, :description)
      end
    end
  end
end
