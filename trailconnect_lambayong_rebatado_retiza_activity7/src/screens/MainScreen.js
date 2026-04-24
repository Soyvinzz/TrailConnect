import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { trailsData, TABS } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { styles } from '../styles/appStyles';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import EmptyState from '../components/EmptyState';
import TabItem from '../components/TabItem';

function HomeScreen() {
  const { events, joinedEventIds, sharedEventIds, handleJoinEvent, handleShareEvent } = useAppContext();

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Top Hardest Climbs (PH)</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {events.length === 0 ? (
          <EmptyState message="No data available yet. Create a hike event from the Create tab." />
        ) : (
          events.map((event) => {
            const joined = joinedEventIds.includes(event.id);
            const shared = sharedEventIds.includes(event.id);
            return (
              <View key={event.id} style={styles.card}>
                <Text style={styles.cardTitle}>{event.title}</Text>
                <Text style={styles.cardSubtitle}>{event.trailName}</Text>
                <Text style={styles.cardMeta}>{event.location}</Text>
                {event.elevationMasl ? <Text style={styles.cardMeta}>Elevation: {event.elevationMasl} MASL</Text> : null}
                <Text style={styles.cardDifficulty}>
                  Difficulty: <Text style={styles.cardDifficultyValue}>{event.difficulty}</Text>
                </Text>
                <Text style={styles.cardDescription}>{event.description}</Text>
                <CustomButton
                  label={joined ? 'Joined' : 'Join Event'}
                  onPress={() => handleJoinEvent(event.id)}
                  disabled={joined}
                />
                <CustomButton
                  label={shared ? 'Shared' : 'Share Event'}
                  onPress={() => handleShareEvent(event.id)}
                  disabled={shared}
                  variant="secondary"
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function TrailsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Top Highest Mountains (PH)</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {trailsData.map((trail) => (
          <View key={trail.id} style={styles.card}>
            <Text style={styles.cardTitle}>{trail.trailName}</Text>
            <Text style={styles.cardMeta}>{trail.location}</Text>
            <Text style={styles.cardMeta}>Elevation: {trail.elevationMasl} MASL</Text>
            <Text style={styles.cardDifficulty}>
              Difficulty: <Text style={styles.cardDifficultyValue}>{trail.difficulty}</Text>
            </Text>
            <Text style={styles.cardDescription}>{trail.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function SafetyScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Safety Essentials</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Leave No Trace</Text>
          <Text style={styles.cardDescription}>
            Pack out all trash, stay on the trail, respect wildlife, and follow local rules.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weather and Timing</Text>
          <Text style={styles.cardDescription}>Check the forecast, start early, and set a strict turnaround time.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function CreateEventScreen() {
  const {
    newTitle,
    newTrailName,
    newDate,
    newDifficulty,
    newDescription,
    setNewTitle,
    setNewTrailName,
    setNewDate,
    setNewDifficulty,
    setNewDescription,
    handleCreateEvent,
  } = useAppContext();

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Create New Event</Text>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <CustomInput label="Event Title" placeholder="Sunrise Summit Hike" value={newTitle} onChangeText={setNewTitle} />
        <CustomInput label="Trail Name" placeholder="Eagle Ridge Trail" value={newTrailName} onChangeText={setNewTrailName} />
        <CustomInput label="Date" placeholder="April 30, 2026" value={newDate} onChangeText={setNewDate} />
        <CustomInput
          label="Difficulty"
          placeholder="Easy / Moderate / Hard"
          value={newDifficulty}
          onChangeText={setNewDifficulty}
        />
        <CustomInput
          label="Description"
          placeholder="Short description of the hiking event..."
          value={newDescription}
          onChangeText={setNewDescription}
          multiline
          style={styles.multilineInput}
        />
        <CustomButton label="Create Event" onPress={handleCreateEvent} />
      </ScrollView>
    </View>
  );
}

function ProfileScreen() {
  const {
    events,
    joinedEventIds,
    userName,
    userEmail,
    userRole,
    isEditingProfile,
    editName,
    editEmail,
    setIsEditingProfile,
    setEditName,
    setEditEmail,
    handleSaveProfile,
    handleLogout,
  } = useAppContext();

  const joinedEvents = events.filter((event) => joinedEventIds.includes(event.id));

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Profile</Text>
      <View style={styles.profileCard}>
        {isEditingProfile ? (
          <>
            <CustomInput label="Name" value={editName} onChangeText={setEditName} />
            <CustomInput label="Email" value={editEmail} onChangeText={setEditEmail} />
            <View style={styles.profileButtonsRow}>
              <CustomButton label="Save" onPress={handleSaveProfile} extraStyle={styles.profileButton} />
              <CustomButton
                label="Cancel"
                variant="secondary"
                onPress={() => {
                  setIsEditingProfile(false);
                  setEditName(userName);
                  setEditEmail(userEmail);
                }}
                extraStyle={styles.profileButton}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.profileLabel}>Name</Text>
            <Text style={styles.profileValue}>{userName}</Text>
            <Text style={styles.profileLabel}>Email</Text>
            <Text style={styles.profileValue}>{userEmail}</Text>
            <Text style={styles.profileLabel}>Role</Text>
            <Text style={styles.profileValue}>{userRole}</Text>
            <CustomButton label="Edit Profile" onPress={() => setIsEditingProfile(true)} extraStyle={styles.profileEditButton} />
          </>
        )}
      </View>

      <Text style={[styles.screenTitle, { marginTop: 16 }]}>Joined Events</Text>
      {joinedEvents.length === 0 ? (
        <EmptyState message="No data available. You have not joined any events yet." />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {joinedEvents.map((event) => (
            <View key={event.id} style={styles.card}>
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardSubtitle}>{event.trailName}</Text>
              <Text style={styles.cardMeta}>{event.location}</Text>
            </View>
          ))}
        </ScrollView>
      )}
      <CustomButton label="Log Out" onPress={handleLogout} extraStyle={styles.logoutButton} textStyle={styles.logoutButtonText} />
    </View>
  );
}

export default function MainScreen() {
  const { activeTab, setActiveTab, userRole } = useAppContext();

  let screen = <HomeScreen />;
  if (activeTab === TABS.TRAILS) screen = <TrailsScreen />;
  if (activeTab === TABS.SAFETY) screen = <SafetyScreen />;
  if (activeTab === TABS.CREATE && userRole === 'Organizer') screen = <CreateEventScreen />;
  if (activeTab === TABS.PROFILE) screen = <ProfileScreen />;

  return (
    <View style={styles.mainContainer}>
      {screen}
      <View style={styles.tabBar}>
        <TabItem label="Home" isActive={activeTab === TABS.HOME} onPress={() => setActiveTab(TABS.HOME)} />
        <TabItem label="Trails" isActive={activeTab === TABS.TRAILS} onPress={() => setActiveTab(TABS.TRAILS)} />
        <TabItem label="Safety" isActive={activeTab === TABS.SAFETY} onPress={() => setActiveTab(TABS.SAFETY)} />
        {userRole === 'Organizer' && (
          <TabItem label="Create" isActive={activeTab === TABS.CREATE} onPress={() => setActiveTab(TABS.CREATE)} />
        )}
        <TabItem label="Profile" isActive={activeTab === TABS.PROFILE} onPress={() => setActiveTab(TABS.PROFILE)} />
      </View>
    </View>
  );
}
