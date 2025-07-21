class CreateStreaks < ActiveRecord::Migration[8.0]
  def change
    create_table :streaks do |t|
      t.references :habit, null: false, foreign_key: true
      t.integer :current_streak
      t.integer :longest_streak
      t.date :last_completed_date

      t.timestamps
    end
  end
end
