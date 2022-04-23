using FF.Feeds.Messages;
using MassTransit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FF.Magdalena.Consumers
{
    public class GameScoreConsumer : IConsumer<MessageCommand<GameScoreDTO>>
    {
        #region Private Fields
        private readonly IGradingService gradingService;
        private readonly IGameRepository gameRepository;
        private readonly ISportTypeService sportTypeService;
        private readonly ILog logger;
        static readonly object _object = new object();
        #endregion

        #region Ctor
        public GameScoreConsumer(IGradingService gradingService, IGameRepository gameRepository, ISportTypeService sportTypeService)
        {
            Ensure.IsNotNull(gradingService, nameof(gradingService));
            Ensure.IsNotNull(gameRepository, nameof(gameRepository));
            Ensure.IsNotNull(sportTypeService, nameof(sportTypeService));

            this.gradingService = gradingService;
            this.gameRepository = gameRepository;
            this.sportTypeService = sportTypeService;
            this.logger = LoggerProvider.Current.Default;
        }
        #endregion

        public async Task Consume(ConsumeContext<MessageCommand<GameScoreDTO>> context)
        {
            try
            {
                lock (_object)
                {
                    if (context.Message.Message.Score.IsFinal)
                    {
                        var game = GetGame(context.Message.Message);

                        if (this.MustBeGraded(game))
                        {
                            context.Message.Message.Header.EventNumber = game.EventNum;
                            var command = Mapper.Current.Map<GradeGameCommand>(context.Message.Message);
                            this.gradingService.Grade(command);
                        }
                    }
                }
            }
            catch (Exception exc)
            {
                this.logger.Error(exc);
                throw;
            }
        }

        #region Private Methods
        private Game GetGame(GameScoreDTO gameScoreDTO)
        {
            if (gameScoreDTO.Header.EventNumber > 0)
            {
                return this.gameRepository.GetById(Convert.ToInt32(gameScoreDTO.Header.EventNumber));
            }

            var gradingGameInfo = Mapper.Current.Map<GradingGameInformation>(gameScoreDTO);
            return this.gameRepository.TryToGetGameToGrade(gradingGameInfo);

        }

        public bool MustBeGraded(Game game)
        {
            if (game.IsNullObject())
            {
                return false;
            }
            var category = this.sportTypeService.GetById(game.Category, game.Subcategory);
            return true;
            //return category.Settings.Autograde;
        }
        #endregion
    }
