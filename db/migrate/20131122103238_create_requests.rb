class CreateRequests < ActiveRecord::Migration
  def change
    create_table :requests do |t|
      t.text :text

      t.timestamps
    end
  end
end
