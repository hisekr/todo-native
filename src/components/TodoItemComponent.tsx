import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import { Circle, CheckCircle2, Trash2 } from "lucide-react-native";

export default function TodoItemComponent({ todo, reload }: any) {
  const toggle = async () => {
    await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", todo.id);

    reload();
  };

  const remove = async () => {
    await supabase.from("todos").delete().eq("id", todo.id);
    reload();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle} style={styles.checkbox}>
        {todo.completed ? (
          <CheckCircle2 size={24} color="#374151" />
        ) : (
          <Circle size={24} color="#d1d5db" />
        )}
      </TouchableOpacity>
      
      <Text 
        style={[
          styles.title,
          todo.completed && styles.titleCompleted
        ]}
      >
        {todo.title}
      </Text>
      
      <TouchableOpacity 
        onPress={remove}
        style={styles.deleteButton}
        activeOpacity={0.7}
      >
        <Trash2 size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  checkbox: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  titleCompleted: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 8,
  },
});
