class Completion < ApplicationRecord
  belongs_to :habit

  validates :completed_date, presence: true
  validates :habit_id, uniqueness: { scope: :completed_date, message: "already completed for this date" }
  
  after_create :update_streak
  after_destroy :update_streak
  
  private
  
  def update_streak
    streak = habit.streak
    return unless streak
    
    # Calculate current streak
    current_streak = 0
    date = Date.today
    
    # Count consecutive days backward from today
    while habit.completed_on?(date)
      current_streak += 1
      date = date - 1.day
    end
    
    # Update streak record
    streak.update(
      current_streak: current_streak,
      longest_streak: [streak.longest_streak, current_streak].max,
      last_completed_date: habit.completions.maximum(:completed_date)
    )
  end
end
