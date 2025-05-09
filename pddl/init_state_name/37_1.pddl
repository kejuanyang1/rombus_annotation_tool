(define (problem scene1)
  (:domain manip)
  (:objects
    large red triangular prism - item
    small red triangular prism_1 - item
    small red triangular prism_2 - item
    large green triangular prism_1 - item
    large green triangular prism_2 - item
    small green triangular prism - item
    yellow basket - container
  )
  (:init
    (ontable large red triangular prism)
    (ontable small red triangular prism_1)
    (ontable large green triangular prism_1)
    (ontable small green triangular prism)
    (in small red triangular prism_2 yellow basket)
    (in large green triangular prism_2 yellow basket)
    (clear large red triangular prism)
    (clear small red triangular prism_1)
    (clear large green triangular prism_1)
    (clear small green triangular prism)
    (clear yellow basket)
    (handempty)
  )
  (:goal (and ))
)