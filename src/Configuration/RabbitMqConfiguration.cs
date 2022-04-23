#region Libraries
using System.Configuration;
#endregion

namespace FF.MagdalenaConfiguration
{
    public class RabbitMqConfiguration : ConfigurationSection
    {
        #region Private Constants
        private const string SECTION_NAME = "rabbitMqConfiguration";
        private const string SUBSECTION_HOST = "host";
        private const string SUBSECTION_USERNAME = "username";
        private const string SUBSECTION_PASSWD = "password";
        private const string SUBSECTION_QUEUES = "queues";
        private const string SUBSECTION_NODES = "nodeNames";
        #endregion

        #region Main Section Name
        internal static string SectionName
        {
            get
            {
                return SECTION_NAME;
            }
        }
        #endregion

        #region Elements

        [ConfigurationProperty(SUBSECTION_HOST, IsRequired = true)]
        public GenericConfigurationElement<string> Host
        {
            get => this[SUBSECTION_HOST] as GenericConfigurationElement<string>;
            set => this[SUBSECTION_HOST] = value;
        }

        [ConfigurationProperty(SUBSECTION_USERNAME, IsRequired = true)]
        public GenericConfigurationElement<string> UserName
        {
            get => this[SUBSECTION_USERNAME] as GenericConfigurationElement<string>;
            set => this[SUBSECTION_USERNAME] = value;
        }

        [ConfigurationProperty(SUBSECTION_PASSWD, IsRequired = true)]
        public GenericConfigurationElement<string> Password
        {
            get => this[SUBSECTION_PASSWD] as GenericConfigurationElement<string>;
            set => this[SUBSECTION_PASSWD] = value;
        }

        [ConfigurationProperty(SUBSECTION_NODES, IsRequired = false)]
        public GenericConfigurationElement<string> NodeNames
        {
            get => this[SUBSECTION_NODES] as GenericConfigurationElement<string>;
            set => this[SUBSECTION_NODES] = value;
        }

        [ConfigurationProperty(SUBSECTION_QUEUES, IsRequired = true)]
        public QueueConfigurationCollection Queues
        {
            get { return this[SUBSECTION_QUEUES] as QueueConfigurationCollection; }
            set { base[SUBSECTION_QUEUES] = value; }
        }
        #endregion
    }
}
