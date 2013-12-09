class CreateJoinTableKeySite < ActiveRecord::Migration
  def change
    create_join_table :keys, :sites, table_name: :roles do |t|
      t.string :title
      t.index [:key_id, :site_id]
      t.index [:site_id, :key_id]
    end

    change_table :keys do |t|
      t.remove :role
      t.remove :site_id
    end

    change_table :sites do |t|
      t.remove :io
    end
  end
end
