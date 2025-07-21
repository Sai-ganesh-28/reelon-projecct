class Habit < ApplicationRecord
  belongs_to :user
  has_many :completions, dependent: :destroy
  has_one :streak, dependent: :destroy

  validates :name, presence: true

  # Create a streak record when a habit is created
  after_create :create_streak_record

  # Check if habit is completed on a specific date
  def completed_on?(date)
    completions.exists?(completed_date: date)
  end

  # Toggle completion status for a specific date
  def toggle_completion(date)
    completion = completions.find_by(completed_date: date)
    if completion
      completion.destroy
      false
    else
      completions.create(completed_date: date)
      true
    end
  end

  private

  def create_streak_record
    create_streak(current_streak: 0, longest_streak: 0)
  end
end
