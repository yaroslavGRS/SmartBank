import React from 'react';
import { View } from 'react-native';
import {
  Text,
  Card,
  Button,
  Divider,
  List,
  ActivityIndicator,
  Avatar,
} from 'react-native-paper';

type PaymentsViewProps = {
  loadingServices: boolean;
  services: any[];
  paymentsHistory: any[];
  handlePayBiller: (service: any) => void;

  paymentTemplates: any[];
  autoPayments: any[];
  scheduledBills: any[];

  styles: any;
};

export function PaymentsView(props: PaymentsViewProps) {
  const {
    loadingServices,
    services,
    paymentsHistory,
    handlePayBiller,
    paymentTemplates,
    autoPayments,
    scheduledBills,
    styles,
  } = props;

  const utilityServices = services.filter(s => s.category === 'utility');
  const mobileServices = services.filter(s => s.category === 'mobile');
  const internetServices = services.filter(s => s.category === 'internet');

  const renderCategoryServices = (
    items: any[],
    title: string,
    icon: string
  ) => {
    if (items.length === 0) return null;

    return (
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          {title}
        </Text>
        {items.map(service => (
          <Card key={service.id} style={{ marginBottom: 10 }}>
            <Card.Title
              title={service.title}
              subtitle={`Amount due: $${service.amountDue.toFixed(2)}`}
              left={props => <Avatar.Icon {...props} icon={icon} />}
            />
            <Card.Actions>
              <Button onPress={() => handlePayBiller(service)}>
                Pay Now
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    );
  };

  const renderPaymentTemplates = () => {
    if (paymentTemplates.length === 0) return null;
    return (
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Payment Templates
        </Text>
        {paymentTemplates.map(tpl => (
          <Card key={tpl.id} style={{ marginBottom: 10 }}>
            <Card.Title
              title={tpl.title}
              subtitle={`Amount: $${tpl.amount} • Account: ${tpl.account}`}
              left={props => <Avatar.Icon {...props} icon="star-outline" />}
            />
            <Card.Actions>
              <Button onPress={() => console.log('Apply template')}>
                Use Template
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    );
  };

  // Виведення "Автоплатежів"
  const renderAutoPayments = () => {
    if (autoPayments.length === 0) return null;
    return (
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Auto Payments
        </Text>
        {autoPayments.map(ap => (
          <Card key={ap.id} style={{ marginBottom: 10 }}>
            <Card.Title
              title={ap.title}
              subtitle={`Every ${ap.interval}, Next: ${ap.nextDate}  •  $${ap.amount}`}
              left={props => <Avatar.Icon {...props} icon="autorenew" />}
            />
            <Card.Actions>
              {/* У реальному застосунку тут можна додати логіку зміни автоплатежу, відключення тощо */}
              <Button onPress={() => console.log('Manage auto payment')}>
                Manage
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    );
  };

  // Виведення "Рахунків до оплати (за розкладом)"
  const renderScheduledBills = () => {
    if (scheduledBills.length === 0) return null;
    return (
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Scheduled Bills
        </Text>
        {scheduledBills.map(sb => (
          <Card key={sb.id} style={{ marginBottom: 10 }}>
            <Card.Title
              title={sb.title}
              subtitle={`Due on ${sb.dueDate} • $${sb.amount}`}
              left={props => <Avatar.Icon {...props} icon="calendar-clock" />}
            />
            <Card.Actions>
              {/* У реальному застосунку тут можна зробити оплату достроково, зміну розкладу тощо */}
              <Button onPress={() => console.log('Pay scheduled bill')}>
                Pay Early
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    );
  };

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Payments
      </Text>

      {loadingServices && (
        <ActivityIndicator animating={true} style={{ marginVertical: 20 }} />
      )}

      {/* Якщо нічого немає */}
      {!loadingServices && services.length === 0 && (
        <Text style={styles.paymentPlaceholder}>No services found.</Text>
      )}

      {/* Якщо є послуги */}
      {!loadingServices && services.length > 0 && (
        <>
          {/* Комунальні */}
          {renderCategoryServices(
            utilityServices,
            'Utility Bills',
            'home-city-outline'
          )}

          {/* Мобільний зв'язок */}
          {renderCategoryServices(
            mobileServices,
            'Mobile Services',
            'cellphone-basic'
          )}

          {/* Інтернет */}
          {renderCategoryServices(
            internetServices,
            'Internet Services',
            'access-point-network'
          )}
        </>
      )}

      {/* 1) Шаблони платежів */}
      {renderPaymentTemplates()}

      {/* 2) Автоплатежі */}
      {renderAutoPayments()}

      {/* 3) Рахунки до оплати за розкладом */}
      {renderScheduledBills()}

      {/* Історія всіх оплат */}
      {paymentsHistory.length > 0 && (
        <>
          <Divider style={styles.divider} />
          <Text style={styles.section}>Payments History</Text>
          {paymentsHistory.map(record => (
            <List.Item
              key={record.id}
              title={`Paid ${record.title} $${record.amount.toFixed(2)}`}
              description={record.date}
              left={props => (
                <List.Icon {...props} icon="check-circle-outline" />
              )}
              style={styles.historyItem}
            />
          ))}
        </>
      )}
    </View>
  );
}
