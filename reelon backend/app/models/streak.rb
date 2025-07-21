class Streak < ApplicationRecord
  belongs_to :habit
  
  validates :current_streak, numericality: { greater_than_or_equal_to: 0 }
  validates :longest_streak, numericality: { greater_than_or_equal_to: 0 }
end
