import { useState } from 'react';

const ProjectSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General' },
    { id: 'members', name: 'Members & Permissions' },
    { id: 'workflows', name: 'Workflows' },
    { id: 'fields', name: 'Custom Fields' },
    { id: 'templates', name: 'Task Templates' },
    { id: 'integrations', name: 'Integrations' },
    { id: 'automation', name: 'Automation' },
    { id: 'export', name: 'Export/Import' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'danger', name: 'Danger Zone' },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 transition-all">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">Project Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Configure your project details, permissions, and integrations</p>
      </div>

      {/* Tab Navigation - Mobile */}
      <div className="lg:hidden border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Navigation - Desktop */}
        <div className="hidden lg:block w-56 border-r border-gray-200 bg-gray-50 p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <>
              {/* Project Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Project Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      id="project-name"
                      defaultValue="BilliMD"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="project-key" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Key
                    </label>
                    <input
                      type="text"
                      id="project-key"
                      defaultValue="BMD"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-gray-100"
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="project-owner" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Owner
                    </label>
                    <select
                      id="project-owner"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                      <option>John Doe (Product Manager)</option>
                      <option>Jane Smith (Engineering Lead)</option>
                      <option>Alex Johnson (CTO)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="project-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Category
                    </label>
                    <select
                      id="project-category"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                      <option>Software Development</option>
                      <option>Marketing</option>
                      <option>Operations</option>
                      <option>Research</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="project-description"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    defaultValue="Healthcare platform for medical bill management and analytics"
                  />
                </div>
              </div>

              {/* Project Visibility */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Visibility & Access</h3>
                <fieldset>
                  <legend className="sr-only">Visibility</legend>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="visibility-public"
                        name="visibility"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        defaultChecked
                      />
                      <label htmlFor="visibility-public" className="ml-3 block text-sm font-medium text-gray-700">
                        <span className="flex items-center">
                          <span>Public</span>
                          <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Recommended
                          </span>
                        </span>
                        <span className="text-gray-500 text-xs">All organization members can view this project</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="visibility-private"
                        name="visibility"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="visibility-private" className="ml-3 block text-sm font-medium text-gray-700">
                        Private
                        <span className="text-gray-500 text-xs">Only project members can view this project</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="visibility-secret"
                        name="visibility"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="visibility-secret" className="ml-3 block text-sm font-medium text-gray-700">
                        Secret
                        <span className="text-gray-500 text-xs">Only visible to people with the direct link</span>
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* Project Timeline */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Target End Date
                    </label>
                    <input
                      type="date"
                      id="end-date"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <input
                    id="time-tracking"
                    name="time-tracking"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="time-tracking" className="ml-2 block text-sm text-gray-700">
                    Enable time tracking for this project
                  </label>
                </div>
              </div>

              {/* Project Features */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Enabled Features</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="feature-tasks"
                        name="feature-tasks"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="feature-tasks" className="font-medium text-gray-700">
                        Tasks
                      </label>
                      <p className="text-gray-500">Enable task management for this project</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="feature-milestones"
                        name="feature-milestones"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="feature-milestones" className="font-medium text-gray-700">
                        Milestones
                      </label>
                      <p className="text-gray-500">Track major project milestones</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="feature-docs"
                        name="feature-docs"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="feature-docs" className="font-medium text-gray-700">
                        Documentation
                      </label>
                      <p className="text-gray-500">Enable project wiki and document storage</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="feature-calendar"
                        name="feature-calendar"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="feature-calendar" className="font-medium text-gray-700">
                        Calendar
                      </label>
                      <p className="text-gray-500">Enable project calendar view</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Members & Permissions */}
          {activeTab === 'members' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Members & Permissions</h3>
              <p className="text-gray-500 mb-6">Manage who has access to this project and their permissions.</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">Current Members (12)</h4>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    + Invite Members
                  </button>
                </div>
                
                <div className="space-y-3">
                  {[1, 2, 3].map((member) => (
                    <div key={member} className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                          {member === 1 ? 'JD' : member === 2 ? 'JS' : 'AJ'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {member === 1 ? 'John Doe' : member === 2 ? 'Jane Smith' : 'Alex Johnson'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member === 1 ? 'Product Manager' : member === 2 ? 'Engineering Lead' : 'CTO'}
                          </p>
                        </div>
                      </div>
                      <select className="text-xs rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <option>{member === 1 ? 'Admin' : 'Member'}</option>
                        <option>Admin</option>
                        <option>Member</option>
                        <option>Viewer</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">Permission Groups</h4>
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-md border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Admins</p>
                        <p className="text-xs text-gray-500">Full access to all project settings and content</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">3 members</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-md border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Members</p>
                        <p className="text-xs text-gray-500">Can create and edit content</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">7 members</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-md border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Viewers</p>
                        <p className="text-xs text-gray-500">Can only view content</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">2 members</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workflows */}
          {activeTab === 'workflows' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Workflow Settings</h3>
              <p className="text-gray-500 mb-6">Configure how tasks move through different statuses in your project.</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Default Workflow</h4>
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <div className="flex space-x-4 overflow-x-auto pb-2">
                    {['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'].map((status) => (
                      <div key={status} className="flex-shrink-0 w-40">
                        <div className="bg-blue-50 border border-blue-100 rounded-t-md p-2 text-center">
                          <span className="text-sm font-medium text-blue-700">{status}</span>
                        </div>
                        <div className="border-l border-r border-b border-gray-200 rounded-b-md h-24"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enable-custom-workflow"
                      name="enable-custom-workflow"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enable-custom-workflow" className="font-medium text-gray-700">
                      Enable custom workflow
                    </label>
                    <p className="text-gray-500">Create your own statuses and transitions</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="limit-status-transitions"
                      name="limit-status-transitions"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="limit-status-transitions" className="font-medium text-gray-700">
                      Limit status transitions
                    </label>
                    <p className="text-gray-500">Control which statuses tasks can move between</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeTab === 'danger' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
              <p className="text-gray-500 mb-6">These actions are irreversible. Please be cautious.</p>
              
              <div className="space-y-6">
                <div className="border border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-red-700">Archive Project</h4>
                      <p className="text-sm text-gray-500">Mark this project as archived. It will be read-only.</p>
                    </div>
                    <button className="px-3 py-1 border border-red-200 text-red-600 rounded-md text-sm font-medium hover:bg-red-50">
                      Archive
                    </button>
                  </div>
                </div>
                
                <div className="border border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-red-700">Delete Project</h4>
                      <p className="text-sm text-gray-500">Permanently delete this project and all its data.</p>
                    </div>
                    <button className="px-3 py-1 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
                      Delete Project
                    </button>
                  </div>
                </div>
                
                <div className="border border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-red-700">Transfer Ownership</h4>
                      <p className="text-sm text-gray-500">Transfer this project to another user or organization.</p>
                    </div>
                    <button className="px-3 py-1 border border-red-200 text-red-600 rounded-md text-sm font-medium hover:bg-red-50">
                      Transfer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would have similar conditional rendering */}

          {/* Action Buttons - Only show for certain tabs */}
          {(activeTab === 'general' || activeTab === 'workflows') && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;