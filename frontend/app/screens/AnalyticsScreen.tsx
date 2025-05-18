import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {
  Appbar,
  Text,
  Button,
  SegmentedButtons,
  Divider,
  List,
  Menu,
  Card,
} from 'react-native-paper';
import { PieChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const categories = [
  { name: 'Food', amount: 350, color: '#f44336' },
  { name: 'Transport', amount: 120, color: '#2196f3' },
  { name: 'Shopping', amount: 200, color: '#ff9800' },
  { name: 'Bills', amount: 150, color: '#4caf50' },
  { name: 'Entertainment', amount: 180, color: '#9c27b0' },
];

const availableCategories = categories.map(c => c.name);

const budgetDynamicsData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [120, 140, 100, 180, 90, 200, 160],
      color: () => '#2196f3',
      strokeWidth: 2,
    },
  ],
};

const initialUncategorized = [
  { id: 1, description: 'McDonalds', amount: 12.5, suggestedCategory: 'Food' },
  { id: 2, description: 'Uber Ride', amount: 8.9, suggestedCategory: 'Transport' },
];

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [uncategorized, setUncategorized] = useState(initialUncategorized);
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

  const total = categories.reduce((acc, cat) => acc + cat.amount, 0);

  const chartData = categories.map(cat => ({
    name: cat.name,
    population: cat.amount,
    color: cat.color,
    legendFontColor: '#333',
    legendFontSize: 14,
  }));

  const assignCategory = (id: number, category: string) => {
    setUncategorized(prev => prev.filter(tx => tx.id !== id));
    console.log(`Transaction ${id} categorized as ${category}`);
  };

  const generateTips = () => {
    const tips: string[] = [];
    categories.forEach(cat => {
      const percentage = (cat.amount / total) * 100;
      if (percentage > 30) {
        tips.push(`Витрати на ${cat.name.toLowerCase()} перевищують 30% — спробуйте зменшити.`);
      }
      if (cat.name === 'Entertainment' && percentage > 20) {
        tips.push('Витрати на розваги трохи високі — подумайте, чи всі вони були необхідні.');
      }
      if (cat.name === 'Transport' && percentage < 10) {
        tips.push('Чудово! Витрати на транспорт ефективно оптимізовані.');
      }
    });
    return tips;
  };

  const generateAchievements = () => {
    const achievements: { title: string; description: string; icon: string }[] = [];

    if ((categories.find(c => c.name === 'Bills')?.amount || 0) < 100) {
      achievements.push({
        title: 'Майстер економії 💡',
        description: 'Тримайте рахунки менше $100 — так тримати!',
        icon: '💡',
      });
    }

    if ((categories.find(c => c.name === 'Entertainment')?.amount || 0) < 150) {
      achievements.push({
        title: 'Контроль над розвагами 🎯',
        description: 'Витрати на розваги менші за $150 — чудовий баланс!',
        icon: '🎯',
      });
    }

    if ((categories.find(c => c.name === 'Food')?.amount || 0) > 300) {
      achievements.push({
        title: 'Гурман 🍔',
        description: 'Ви витратили понад $300 на їжу — смакота!',
        icon: '🍔',
      });
    }

    return achievements;
  };

  const optimizationTips = generateTips();
  const achievements = generateAchievements();

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Analytics" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.filters}>
        <SegmentedButtons
          value={period}
          onValueChange={value => setPeriod(value as 'day' | 'week' | 'month')}
          buttons={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
          style={styles.segmented}
        />
      </View>

      <Divider style={{ marginVertical: 16 }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>
          {period.charAt(0).toUpperCase() + period.slice(1)} Overview
        </Text>

        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: () => '#333',
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />

        <Text style={styles.sectionTitle}>Budget Dynamics</Text>
        <LineChart
          data={budgetDynamicsData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: () => '#2196f3',
            labelColor: () => '#333',
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#2196f3',
            },
          }}
          bezier
          style={{
            borderRadius: 8,
            marginBottom: 16,
          }}
        />

        <Text style={styles.sectionTitle}>Categories</Text>
        {categories.map(cat => (
          <List.Item
            key={cat.name}
            title={`${cat.name} - $${cat.amount}`}
            left={props => (
              <List.Icon {...props} icon="circle" color={cat.color} />
            )}
            right={props => (
              <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>
                {((cat.amount / total) * 100).toFixed(1)}%
              </Text>
            )}
            style={styles.listItem}
          />
        ))}

        <Text style={styles.sectionTitle}>Uncategorized Transactions</Text>
        {uncategorized.map(tx => (
          <View key={tx.id} style={styles.uncatItem}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '500' }}>{tx.description}</Text>
              <Text style={{ color: '#888' }}>${tx.amount.toFixed(2)}</Text>
              <Text style={{ fontStyle: 'italic', color: '#555' }}>
                Suggested: {tx.suggestedCategory}
              </Text>
            </View>
            <Menu
              visible={openMenus[tx.id]}
              onDismiss={() =>
                setOpenMenus(prev => ({ ...prev, [tx.id]: false }))
              }
              anchor={
                <Button
                  onPress={() =>
                    setOpenMenus(prev => ({ ...prev, [tx.id]: true }))
                  }
                  mode="outlined"
                >
                  Categorize
                </Button>
              }
            >
              {availableCategories.map(cat => (
                <Menu.Item
                  key={cat}
                  title={cat}
                  onPress={() => assignCategory(tx.id, cat)}
                />
              ))}
            </Menu>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Budget Optimization Tips</Text>
        {optimizationTips.length > 0 ? (
          optimizationTips.map((tip, index) => (
            <Card key={index} style={styles.tipCard}>
              <Card.Content>
                <Text>{tip}</Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={{ fontStyle: 'italic', color: '#555' }}>
            Все виглядає добре! Ваш бюджет у нормі.
          </Text>
        )}

        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.length > 0 ? (
          achievements.map((a, index) => (
            <Card key={index} style={styles.tipCard}>
              <Card.Content>
                <Text style={{ fontSize: 18 }}>{a.icon} {a.title}</Text>
                <Text style={{ marginTop: 4, color: '#555' }}>{a.description}</Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={{ fontStyle: 'italic', color: '#555' }}>
            Досягнень поки немає. Працюйте над бюджетом і ви отримаєте перші!
          </Text>
        )}

        <Button
          icon="chart-box"
          mode="contained-tonal"
          onPress={() => console.log('Go to detailed analytics')}
          style={styles.detailsButton}
        >
          Detailed Reports
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  filters: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  segmented: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  uncatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
    marginBottom: 8,
  },
  tipCard: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  detailsButton: {
    marginTop: 24,
    borderRadius: 8,
  },
});
