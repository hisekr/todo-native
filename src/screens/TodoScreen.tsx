import { useEffect, useState } from "react";
import { View, TextInput, FlatList, SafeAreaView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import TodoItem from "../components/TodoItemComponent";
import { Plus, LogOut, CheckCircle2 } from "lucide-react-native";

export default function TodoScreen() {
  const [todos, setTodos] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTodos = async () => {
    const { data } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    setTodos(data || []);
  };

  const addTodo = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    await supabase.from("todos").insert({
      title: text,
      user_id: user.id,
    });

    setText("");
    loadTodos();
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>My Tasks</Text>
            <Text style={styles.subtitle}>
              {completedCount} of {todos.length} completed
            </Text>
          </View>
          <TouchableOpacity 
            onPress={logout}
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <LogOut size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Todo List */}
      <FlatList
        data={todos}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TodoItem todo={item} reload={loadTodos} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <CheckCircle2 size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No tasks yet</Text>
            <Text style={styles.emptySubtitle}>Add one below to get started</Text>
          </View>
        }
      />

      {/* Add Todo Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Add a new task..."
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            onPress={addTodo}
            disabled={loading || !text.trim()}
            style={[
              styles.addButton,
              (!text.trim() || loading) && styles.addButtonDisabled
            ]}
            activeOpacity={0.7}
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 100,
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#9ca3af',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 46,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  inputWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#111827',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
});
