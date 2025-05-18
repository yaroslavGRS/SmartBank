import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Surface,
  TextInput,
  Button,
  List,
  HelperText,
  Divider,
  Avatar,
  IconButton,
  Card,
} from 'react-native-paper';

type TransfersViewProps = {
  transferTypes: any[];
  mockAccounts: any[];

  type: 'internal' | 'external' | 'iban' | 'card' | 'qr';
  setType: (val: any) => void;

  fromAccount: string;
  setFromAccount: (val: string) => void;

  toAccount: string;
  setToAccount: (val: string) => void;

  recipient: string;
  setRecipient: (val: string) => void;

  sourceAccount: string;
  setSourceAccount: (val: string) => void;

  amount: string;
  setAmount: (val: string) => void;

  comment: string;
  setComment: (val: string) => void;

  history: any[];
  setHistory: (val: any[]) => void;

  templates: any[];
  setTemplates: (val: any[]) => void;

  styles: any;
  ACCENT_COLOR: string;
};

export function TransfersView(props: TransfersViewProps) {
  const {
    transferTypes,
    mockAccounts,
    type, setType,
    fromAccount, setFromAccount,
    toAccount, setToAccount,
    recipient, setRecipient,
    sourceAccount, setSourceAccount,
    amount, setAmount,
    comment, setComment,
    history, setHistory,
    templates, setTemplates,
    styles,
  } = props;

  const isAmountInvalid = Number(amount) > 10000;

  const handleConfirm = () => {
    if (!amount || isAmountInvalid) return;

    const common = {
      id: Date.now(),
      amount: parseFloat(amount),
      comment,
      date: new Date().toDateString().slice(4),
    };

    let newTransfer;
    if (type === 'internal') {
      if (fromAccount === toAccount) return;
      const fromName = mockAccounts.find(a => a.id === fromAccount)?.name;
      const toName = mockAccounts.find(a => a.id === toAccount)?.name;
      newTransfer = {
        ...common,
        type,
        from: fromName!,
        to: toName!,
      };
    } else {
      if (!recipient) return;
      const fromName = mockAccounts.find(a => a.id === sourceAccount)?.name;
      newTransfer = {
        ...common,
        type,
        from: fromName!,
        to: recipient,
      };
    }

    setHistory([newTransfer, ...history]);
    setAmount('');
    setComment('');
    setRecipient('');
  };
  const handleSaveTemplate = () => {
    const template = {
      id: Date.now(),
      type,
      from: type === 'internal' ? fromAccount : sourceAccount,
      to: type === 'internal' ? toAccount : recipient,
      comment,
      amount,
    };
    setTemplates([template, ...templates]);
  };
  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter(t => t.id !== id));
  };
  const handleApplyTemplate = (template: any) => {
    setType(template.type);
    if (template.type === 'internal') {
      setFromAccount(template.from);
      setToAccount(template.to);
    } else {
      setSourceAccount(template.from);
      setRecipient(template.to);
    }
    setAmount(String(template.amount));
    setComment(template.comment);
  };

  return (
    <>
      <Text style={styles.switchTitle}>Choose Transfer Type</Text>
      <View style={styles.transferGrid}>
        {transferTypes.map(item => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.transferOption,
              type === item.key && styles.activeOption,
            ]}
            onPress={() => setType(item.key as any)}
          >
            <Avatar.Icon icon={item.icon} size={40} style={styles.optionIcon} />
            <Text style={styles.optionLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Surface style={styles.formCard}>
        {type === 'internal' ? (
          <View>
            <View style={styles.accountSelector}>
              <Avatar.Icon size={40} icon="bank" style={styles.accountIcon} />
              <View style={styles.accountInfo}>
                <Text style={styles.accountLabel}>From Account</Text>
                <Text style={styles.accountName}>
                  {mockAccounts.find(a => a.id === fromAccount)?.name}
                </Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsList}>
              {mockAccounts.map(a => (
                <TouchableOpacity
                  key={a.id}
                  style={[
                    styles.accountChip,
                    fromAccount === a.id && styles.accountChipActive
                  ]}
                  onPress={() => setFromAccount(a.id)}
                >
                  <Text
                    style={[
                      styles.accountChipText,
                      fromAccount === a.id && styles.accountChipTextActive
                    ]}
                  >
                    {a.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.transferArrow}>
              <IconButton icon="arrow-down" size={28} />
            </View>

            <View style={styles.accountSelector}>
              <Avatar.Icon size={40} icon="bank-transfer" style={styles.accountIcon} />
              <View style={styles.accountInfo}>
                <Text style={styles.accountLabel}>To Account</Text>
                <Text style={styles.accountName}>
                  {mockAccounts.find(a => a.id === toAccount)?.name}
                </Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsList}>
              {mockAccounts.map(a => (
                <TouchableOpacity
                  key={a.id}
                  style={[
                    styles.accountChip,
                    toAccount === a.id && styles.accountChipActive
                  ]}
                  onPress={() => setToAccount(a.id)}
                >
                  <Text
                    style={[
                      styles.accountChipText,
                      toAccount === a.id && styles.accountChipTextActive
                    ]}
                  >
                    {a.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View>
            <View style={styles.accountSelector}>
              <Avatar.Icon size={40} icon="bank" style={styles.accountIcon} />
              <View style={styles.accountInfo}>
                <Text style={styles.accountLabel}>From Account</Text>
                <Text style={styles.accountName}>
                  {mockAccounts.find(a => a.id === sourceAccount)?.name}
                </Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsList}>
              {mockAccounts.map(a => (
                <TouchableOpacity
                  key={a.id}
                  style={[
                    styles.accountChip,
                    sourceAccount === a.id && styles.accountChipActive
                  ]}
                  onPress={() => setSourceAccount(a.id)}
                >
                  <Text
                    style={[
                      styles.accountChipText,
                      sourceAccount === a.id && styles.accountChipTextActive
                    ]}
                  >
                    {a.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              label={
                type === 'iban'
                  ? 'Recipient IBAN'
                  : type === 'card'
                  ? 'Card Number'
                  : type === 'qr'
                  ? 'QR Code'
                  : 'Account Number / Name'
              }
              mode="outlined"
              value={recipient}
              onChangeText={setRecipient}
              style={styles.recipientInput}
            />
          </View>
        )}

        <View style={styles.amountBlock}>
          <Text style={styles.amountLabel}>Amount</Text>
          <View style={styles.amountField}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={[styles.amountInput, { backgroundColor: 'transparent' }]}
              placeholder="0.00"
            />
          </View>
          <HelperText
            type={isAmountInvalid ? 'error' : 'info'}
            visible={true}
            style={styles.amountHelper}
          >
            {isAmountInvalid ? 'Limit exceeded ($10,000)' : 'Enter transfer amount'}
          </HelperText>
        </View>

        <TextInput
          label="Comment (optional)"
          mode="outlined"
          value={comment}
          onChangeText={setComment}
          style={styles.commentInput}
          multiline
        />

        <Button
          mode="contained"
          onPress={handleConfirm}
          style={styles.confirmButton}
          disabled={
            isAmountInvalid ||
            !amount ||
            (type === 'internal' && fromAccount === toAccount) ||
            (type !== 'internal' && !recipient)
          }
        >
          Confirm Transfer
        </Button>

        <Button
          mode="text"
          onPress={handleSaveTemplate}
          style={styles.templateButton}
        >
          Save as Template
        </Button>
      </Surface>

      {templates.length > 0 && (
        <>
          <Divider style={styles.divider} />
          <Text style={styles.section}>Saved Templates</Text>
          {templates.map(tpl => (
            <Card key={tpl.id} style={styles.templateCard}>
              <Card.Title
                title={`$${tpl.amount} → ${tpl.to}`}
                subtitle={tpl.comment || 'No comment'}
                left={props => <Avatar.Icon {...props} icon="star-outline" />}
                right={props => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton
                      icon="play"
                      {...props}
                      onPress={() => handleApplyTemplate(tpl)}
                    />
                    <IconButton
                      icon="delete"
                      {...props}
                      onPress={() => handleDeleteTemplate(tpl.id)}
                    />
                  </View>
                )}
              />
            </Card>
          ))}
        </>
      )}

      <Divider style={styles.divider} />
      <Text style={styles.section}>Transfer History</Text>
      {history.map(tx => (
        <List.Item
          key={tx.id}
          title={`$${tx.amount.toFixed(2)} from ${tx.from} to ${tx.to}`}
          description={`${tx.date}${tx.comment ? ` • ${tx.comment}` : ''}`}
          left={props => (
            <List.Icon
              {...props}
              icon={
                tx.type === 'internal'
                  ? 'bank-transfer-in'
                  : tx.type === 'iban'
                  ? 'bank-outline'
                  : tx.type === 'card'
                  ? 'credit-card-outline'
                  : tx.type === 'qr'
                  ? 'qrcode-scan'
                  : 'bank'
              }
            />
          )}
          style={styles.historyItem}
        />
      ))}
    </>
  );
}
