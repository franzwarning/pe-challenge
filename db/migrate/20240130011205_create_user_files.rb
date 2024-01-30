class CreateUserFiles < ActiveRecord::Migration[7.1]
  def change
    create_table :user_files do |t|
      t.string :file_name, null: false
      t.string :bucket_path, null: false
      t.timestamps
    end
  end
end
