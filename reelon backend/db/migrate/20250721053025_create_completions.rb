class CreateCompletions < ActiveRecord::Migration[8.0]
  def change
    create_table :completions do |t|
      t.references :habit, null: false, foreign_key: true
      t.date :completed_date

      t.timestamps
    end
  end
end
