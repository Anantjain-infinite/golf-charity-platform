import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAddScore } from '../hooks/useScores';
import { SCORE_MIN, SCORE_MAX } from '../../../utils/constants';

const schema = yup.object({
  score: yup
    .number()
    .typeError('Score must be a number')
    .integer('Score must be a whole number')
    .min(SCORE_MIN, `Score must be at least ${SCORE_MIN}`)
    .max(SCORE_MAX, `Score must be no more than ${SCORE_MAX}`)
    .required('Score is required'),
  played_date: yup
    .string()
    .required('Date is required')
    .test('not-future', 'Date cannot be in the future', (value) => {
      if (!value) return true;
      return new Date(value) <= new Date();
    }),
});

const ScoreEntryForm = () => {
  const { mutate: addScore, isPending } = useAddScore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      played_date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (values) => {
    addScore(
      { score: Number(values.score), played_date: values.played_date },
      { onSuccess: () => reset({ played_date: new Date().toISOString().split('T')[0] }) }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr auto',
          gap: '12px',
          alignItems: 'end',
        }}
      >
        <div>
          <label className="label">Stableford Score</label>
          <input
            {...register('score')}
            type="number"
            className="input"
            placeholder="1 - 45"
            min={SCORE_MIN}
            max={SCORE_MAX}
          />
          {errors.score && (
            <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>
              {errors.score.message}
            </p>
          )}
        </div>

        <div>
          <label className="label">Date Played</label>
          <input
            {...register('played_date')}
            type="date"
            className="input"
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.played_date && (
            <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>
              {errors.played_date.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={isPending}
          style={{ whiteSpace: 'nowrap' }}
        >
          {isPending ? 'Saving...' : 'Add Score'}
        </button>
      </div>
    </form>
  );
};

export default ScoreEntryForm;