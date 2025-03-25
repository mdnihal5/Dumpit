import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const HelpScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [ticketData, setTicketData] = useState({
    subject: '',
    description: '',
    priority: 'medium',
  });

  const faqs = [
    {
      question: 'How do I track my order?',
      answer:
        'You can track your order by going to the Orders section in your profile. Click on the specific order to view detailed tracking information.',
    },
    {
      question: 'What payment methods are accepted?',
      answer:
        'We accept all major credit/debit cards, UPI, net banking, and cash on delivery.',
    },
    {
      question: 'How can I cancel my order?',
      answer:
        'You can cancel your order within 24 hours of placing it. Go to your order details and click on the Cancel Order button.',
    },
    {
      question: 'What is the delivery time?',
      answer:
        'Standard delivery time is 2-3 business days. Express delivery is available for select items with next-day delivery.',
    },
    {
      question: 'How do I return items?',
      answer:
        'You can initiate a return within 7 days of receiving the item. Go to your order details and click on the Return button.',
    },
  ];

  const handleCreateTicket = () => {
    if (!ticketData.subject || !ticketData.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // TODO: Implement ticket creation API call
    setShowTicketModal(false);
    setTicketData({
      subject: '',
      description: '',
      priority: 'medium',
    });
    Alert.alert('Success', 'Support ticket created successfully');
  };

  const handleContactSupport = (method) => {
    switch (method) {
      case 'phone':
        Linking.openURL('tel:+1234567890');
        break;
      case 'email':
        Linking.openURL('mailto:support@example.com');
        break;
      case 'whatsapp':
        Linking.openURL('https://wa.me/1234567890');
        break;
      default:
        break;
    }
  };

  const renderFaqs = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      {faqs.map((faq, index) => (
        <TouchableOpacity
          key={index}
          style={styles.faqItem}
          onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
        >
          <View style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Icon
              name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.primary}
            />
          </View>
          {expandedFaq === index && (
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContactOptions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <View style={styles.contactGrid}>
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactSupport('phone')}
        >
          <Icon name="phone" size={32} color={COLORS.primary} />
          <Text style={styles.contactLabel}>Call Us</Text>
          <Text style={styles.contactValue}>+1 (234) 567-890</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactSupport('email')}
        >
          <Icon name="email" size={32} color={COLORS.primary} />
          <Text style={styles.contactLabel}>Email Us</Text>
          <Text style={styles.contactValue}>support@example.com</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactSupport('whatsapp')}
        >
          <Icon name="whatsapp" size={32} color={COLORS.primary} />
          <Text style={styles.contactLabel}>WhatsApp</Text>
          <Text style={styles.contactValue}>+1 (234) 567-890</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSupportTicketModal = () => (
    <Modal
      visible={showTicketModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowTicketModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Support Ticket</Text>
            <TouchableOpacity
              onPress={() => setShowTicketModal(false)}
            >
              <Icon name="close" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm}>
            <Input
              label="Subject"
              value={ticketData.subject}
              onChangeText={(text) =>
                setTicketData({ ...ticketData, subject: text })
              }
              placeholder="Enter ticket subject"
            />
            <Input
              label="Description"
              value={ticketData.description}
              onChangeText={(text) =>
                setTicketData({ ...ticketData, description: text })
              }
              placeholder="Describe your issue"
              multiline
              numberOfLines={4}
            />
            <View style={styles.priorityContainer}>
              <Text style={styles.priorityLabel}>Priority</Text>
              <View style={styles.priorityOptions}>
                <TouchableOpacity
                  style={[
                    styles.priorityOption,
                    ticketData.priority === 'low' && styles.prioritySelected,
                  ]}
                  onPress={() =>
                    setTicketData({ ...ticketData, priority: 'low' })
                  }
                >
                  <Text
                    style={[
                      styles.priorityText,
                      ticketData.priority === 'low' && styles.priorityTextSelected,
                    ]}
                  >
                    Low
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.priorityOption,
                    ticketData.priority === 'medium' && styles.prioritySelected,
                  ]}
                  onPress={() =>
                    setTicketData({ ...ticketData, priority: 'medium' })
                  }
                >
                  <Text
                    style={[
                      styles.priorityText,
                      ticketData.priority === 'medium' && styles.priorityTextSelected,
                    ]}
                  >
                    Medium
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.priorityOption,
                    ticketData.priority === 'high' && styles.prioritySelected,
                  ]}
                  onPress={() =>
                    setTicketData({ ...ticketData, priority: 'high' })
                  }
                >
                  <Text
                    style={[
                      styles.priorityText,
                      ticketData.priority === 'high' && styles.priorityTextSelected,
                    ]}
                  >
                    High
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button title="Submit Ticket" onPress={handleCreateTicket} />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {renderFaqs()}
        {renderContactOptions()}
      </ScrollView>

      <TouchableOpacity
        style={styles.createTicketButton}
        onPress={() => setShowTicketModal(true)}
      >
        <Icon name="ticket-outline" size={24} color={COLORS.white} />
        <Text style={styles.createTicketText}>Create Support Ticket</Text>
      </TouchableOpacity>

      {renderSupportTicketModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.large,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: SPACING.medium,
  },
  title: {
    fontSize: FONTS.size.h2,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: SPACING.large,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.large,
  },
  sectionTitle: {
    fontSize: FONTS.size.h3,
    fontWeight: 'bold',
    marginBottom: SPACING.medium,
  },
  faqItem: {
    backgroundColor: COLORS.background,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.medium,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: FONTS.size.h4,
    fontWeight: 'bold',
    flex: 1,
    marginRight: SPACING.medium,
  },
  faqAnswer: {
    fontSize: FONTS.size.h5,
    color: COLORS.secondary,
    marginTop: SPACING.medium,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.small,
  },
  contactItem: {
    flex: 1,
    minWidth: '33.33%',
    padding: SPACING.medium,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    margin: SPACING.small,
    borderRadius: BORDER_RADIUS.medium,
  },
  contactLabel: {
    fontSize: FONTS.size.h4,
    fontWeight: 'bold',
    marginTop: SPACING.small,
  },
  contactValue: {
    fontSize: FONTS.size.h5,
    color: COLORS.secondary,
    marginTop: SPACING.xsmall,
  },
  createTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: SPACING.large,
    margin: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
  },
  createTicketText: {
    color: COLORS.white,
    fontSize: FONTS.size.h4,
    fontWeight: 'bold',
    marginLeft: SPACING.small,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONTS.size.h3,
    fontWeight: 'bold',
  },
  modalForm: {
    padding: SPACING.large,
  },
  priorityContainer: {
    marginTop: SPACING.medium,
  },
  priorityLabel: {
    fontSize: FONTS.size.h4,
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  priorityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flex: 1,
    padding: SPACING.medium,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
    marginHorizontal: SPACING.xsmall,
  },
  prioritySelected: {
    backgroundColor: COLORS.primary,
  },
  priorityText: {
    fontSize: FONTS.size.h5,
    textAlign: 'center',
  },
  priorityTextSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  modalFooter: {
    padding: SPACING.large,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default HelpScreen; 